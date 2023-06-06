// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract CropLink {
    address payable public treasury;
    uint256 public treasuryBalance;

    struct Produce {
        string name;
        uint256 quantity;
        uint256 price;
        bool sold;
    }

    struct MarketPrice {
        address buyer;
        uint256 price;
    }

    struct WeatherData {
        string weatherCondition;
        bool isRainy;
    }

    struct TruflationData {
        uint256 truflationRate;
        // Add any other relevant Truflation data fields
    }

    AggregatorV3Interface private demandAggregator;
    AggregatorV3Interface private supplyAggregator;
    AggregatorV3Interface private truflationAggregator;
    LinkTokenInterface private link;

    address[] public farmerAddresses;
    address[] public buyerAddresses;

    mapping(address => bool) public farmers;
    mapping(address => bool) public buyers;
    mapping(address => bool) public farmerVerifications;
    mapping(address => bool) public buyerVerifications;
    mapping(address => Produce[]) public produceList;
    mapping(address => MarketPrice) public marketPrices;
    mapping(address => bool) public marketPriceVerified;

    mapping(bytes32 => address) private requestIdToAddress;
    mapping(bytes32 => uint256) private requestIdToIndex;

    mapping(bytes32 => WeatherData) private requestIdToWeatherData;
    mapping(bytes32 => TruflationData) private requestIdToTruflationData;
    mapping(address => TruflationData) public truflationDataMap;

    constructor() {
        // accuweatherConsumer = new AccuweatherConsumer(
        //     linkAddress,
        //     oracleAddress
        // );
        treasury = payable(msg.sender);
        treasuryBalance = 5 ether;
    }

    function registerAsFarmer() public {
        require(!farmers[msg.sender], "Already registered as farmer");

        farmers[msg.sender] = true;
        farmerAddresses.push(msg.sender);
    }

    function registerAsBuyer() public {
        require(!buyers[msg.sender], "Already registered as buyer");

        buyers[msg.sender] = true;
        buyerAddresses.push(msg.sender);
    }

    function verifyFarmer() public {
        require(
            farmers[msg.sender],
            "Only registered farmers can verify themselves"
        );
        farmerVerifications[msg.sender] = true;
    }

    function verifyBuyer() public {
        require(
            buyers[msg.sender],
            "Only registered buyers can verify themselves"
        );
        buyerVerifications[msg.sender] = true;
    }

    function claimTreasury() public {
        require(
            farmerVerifications[msg.sender],
            "Only verified farmers can claim treasury benefits"
        );
        require(
            treasuryBalance >= 0.05 ether,
            "Insufficient funds in the treasury"
        );
        payable(msg.sender).transfer(0.05 ether);
        treasuryBalance -= 0.05 ether;
    }

    function addProduce(
        string memory _name,
        uint256 _quantity,
        uint256 _price
    ) public {
        require(farmers[msg.sender], "Only registered farmers can add produce");
        produceList[msg.sender].push(Produce(_name, _quantity, _price, false));
    }

    function getFarmers() public view returns (address[] memory) {
        return farmerAddresses;
    }

    function getBuyers() public view returns (address[] memory) {
        return buyerAddresses;
    }

    function getAllProduceList() public view returns (Produce[] memory) {
        uint totalProduces = 0;
        for (uint i = 0; i < farmerAddresses.length; i++) {
            totalProduces += produceList[farmerAddresses[i]].length;
        }

        Produce[] memory allProduces = new Produce[](totalProduces);
        uint count = 0;
        for (uint i = 0; i < farmerAddresses.length; i++) {
            for (uint j = 0; j < produceList[farmerAddresses[i]].length; j++) {
                allProduces[count] = produceList[farmerAddresses[i]][j];
                count++;
            }
        }

        return allProduces;
    }

    function getProduceList(
        address _farmer
    ) public view returns (Produce[] memory) {
        require(farmers[_farmer], "Invalid farmer address");
        return produceList[_farmer];
    }

    function getMarketPrices() public view returns (MarketPrice[] memory) {
        MarketPrice[] memory allPrices = new MarketPrice[](
            buyerAddresses.length
        );

        for (uint i = 0; i < buyerAddresses.length; i++) {
            if (marketPrices[buyerAddresses[i]].price > 0) {
                allPrices[i] = marketPrices[buyerAddresses[i]];
            }
        }

        return allPrices;
    }

    function purchaseProduce(address _farmer, uint256 _index) public payable {
        require(
            buyers[msg.sender],
            "Only registered buyers can purchase produce"
        );
        require(
            buyerVerifications[msg.sender],
            "Only verified buyers can purchase produce"
        );
        Produce[] storage produces = produceList[_farmer];
        require(_index < produces.length, "Invalid produce index");
        Produce storage produce = produces[_index];
        require(!produce.sold, "Produce has already been sold");

        if (marketPriceVerified[_farmer]) {
            require(
                msg.value >= marketPrices[_farmer].price,
                "Insufficient funds"
            );
            produce.price = marketPrices[_farmer].price;
        } else {
            require(msg.value == produce.price, "Incorrect amount of funds");
        }

        produce.sold = true;
        removeSoldProduce(_farmer, _index);
    }

    function editProduce(
        uint256 _index,
        string memory _name,
        uint256 _quantity,
        uint256 _price
    ) public {
        require(
            farmers[msg.sender],
            "Only registered farmers can edit produce"
        );
        Produce[] storage produces = produceList[msg.sender];
        require(_index < produces.length, "Invalid produce index");
        Produce storage produce = produces[_index];
        require(!produce.sold, "Cannot edit sold produce");
        produce.name = _name;
        produce.quantity = _quantity;
        produce.price = _price;
    }

    function deleteProduce(uint256 _index) public {
        require(
            farmers[msg.sender],
            "Only registered farmers can delete produce"
        );
        Produce[] storage produces = produceList[msg.sender];
        require(_index < produces.length, "Invalid produce index");
        Produce storage produce = produces[_index];
        require(!produce.sold, "Cannot delete sold produce");
        // Move the last element to the position of the item to be deleted
        produces[_index] = produces[produces.length - 1];
        produces.pop();
    }

    function removeSoldProduce(address _farmer, uint256 _index) internal {
        Produce[] storage produces = produceList[_farmer];
        require(_index < produces.length, "Invalid produce index");
        // Move the last element to the position of the item to be deleted
        produces[_index] = produces[produces.length - 1];
        produces.pop();
    }

    function setMarketPrice(uint256 _price) public {
        require(
            buyers[msg.sender],
            "Only registered buyers can set market price"
        );
        marketPrices[msg.sender] = MarketPrice(msg.sender, _price);
        marketPriceVerified[msg.sender] = true;
    }

    // Chainlink Integration

    // function updateProduceDemand() public {
    //     bytes32 requestId = requestDemandData();
    //     requestIdToAddress[requestId] = msg.sender;
    // }

    // function fulfillProduceDemand(
    //     bytes32 _requestId,
    //     int256 _demand
    // ) public recordKeeperAction(_requestId) {
    //     address farmer = requestIdToAddress[_requestId];
    //     uint256 index = requestIdToIndex[_requestId];

    //     require(farmers[farmer], "Invalid farmer address");

    //     Produce[] storage produces = produceList[farmer];
    //     require(index < produces.length, "Invalid produce index");
    //     Produce storage produce = produces[index];
    //     require(!produce.sold, "Produce has already been sold");

    //     require(_demand > 0, "Invalid demand value");
    //     produce.quantity = uint256(_demand);
    // }

    // function updateProduceSupply() public {
    //     bytes32 requestId = requestSupplyData();
    //     requestIdToAddress[requestId] = msg.sender;
    // }

    // function fulfillProduceSupply(
    //     bytes32 _requestId,
    //     int256 _supply
    // ) public recordKeeperAction(_requestId) {
    //     address farmer = requestIdToAddress[_requestId];
    //     uint256 index = requestIdToIndex[_requestId];

    //     require(farmers[farmer], "Invalid farmer address");

    //     Produce[] storage produces = produceList[farmer];
    //     require(index < produces.length, "Invalid produce index");
    //     Produce storage produce = produces[index];
    //     require(!produce.sold, "Produce has already been sold");

    //     require(_supply > 0, "Invalid supply value");
    //     produce.quantity = uint256(_supply);
    // }

    function calculateAdjustedPrice(
        address _farmer,
        uint256 _index
    ) internal view returns (uint256) {
        uint256 originalPrice = produceList[_farmer][_index].price;
        uint256 truflationRate = truflationDataMap[_farmer].truflationRate;
        uint256 adjustedPrice = (originalPrice * truflationRate) / 100; // Adjust the price based on the truflation rate
        return adjustedPrice;
    }

    // Treasury Functions

    // function updateTruflationData() public {
    //     bytes32 requestId = requestTruflationData();
    //     requestIdToAddress[requestId] = msg.sender;
    // }

    // function fulfillTruflationData(
    //     bytes32 _requestId,
    //     int256 _truflation
    // ) public recordKeeperAction(_requestId) {
    //     address farmer = requestIdToAddress[_requestId];

    //     require(farmers[farmer], "Invalid farmer address");

    //     TruflationData storage truflationData = requestIdToTruflationData[
    //         _requestId
    //     ];
    //     truflationData.truflationRate = uint256(_truflation);

    //     // Process Truflation data
    //     // ...
    // }

    // Selling Produce at Market Price

    // function checkWeather() public {
    //     bytes32 requestId = requestWeatherData();
    //     requestIdToAddress[requestId] = msg.sender;
    // }

    // function fulfillWeather(
    //     bytes32 _requestId,
    //     string memory _weatherCondition
    // ) public recordKeeperAction(_requestId) {
    //     address buyer = requestIdToAddress[_requestId];

    //     require(buyers[buyer], "Invalid buyer address");
    //     require(
    //         buyerVerifications[buyer],
    //         "Only verified buyers can purchase produce"
    //     );

    //     WeatherData storage weatherData = requestIdToWeatherData[_requestId];
    //     weatherData.weatherCondition = _weatherCondition;
    //     weatherData.isRainy = isRainy(_weatherCondition);

    //     if (weatherData.isRainy) {
    //         sellProduceAtMarketPrice(buyer);
    //     }
    // }

    function sellProduceAtMarketPrice(address payable _buyer) public {
        Produce[] storage produces = produceList[msg.sender];

        for (uint256 i = 0; i < produces.length; i++) {
            Produce storage produce = produces[i];

            if (!produce.sold) {
                transferFunds(_buyer, produce.price);
                produce.sold = true;
            }
        }
    }

    function transferFunds(
        address payable _recipient,
        uint256 _amount
    ) internal {
        require(_amount > 0, "Invalid amount");
        require(
            treasuryBalance >= _amount,
            "Insufficient funds in the treasury"
        );

        _recipient.transfer(_amount);
        treasuryBalance -= _amount;
    }

    // Helper Functions

    function isRainy(
        string memory _weatherCondition
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(_weatherCondition)) ==
            keccak256(abi.encodePacked("rainy")));
    }
}
