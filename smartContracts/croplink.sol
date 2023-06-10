// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract CropLink is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18

    address payable public treasury;
    uint256 public treasuryBalance;

    int256 public temperature;

    struct Produce {
        string name;
        uint256 quantity;
        uint256 price;
        bool sold;
        uint256 index;
        address farmer;
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
        setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);

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
        uint256 index = produceList[msg.sender].length;
        produceList[msg.sender].push(
            Produce(_name, _quantity, _price, false, index, msg.sender)
        );
    }

    function adjustPriceByWeather() public view returns (int256) {
        if (temperature > 50) {
            return 10;
        } else if (temperature < 10) {
            return -10;
        }

        return 0;
    }

    function getFarmers() public view returns (address[] memory) {
        return farmerAddresses;
    }

    function getBuyers() public view returns (address[] memory) {
        return buyerAddresses;
    }

    function getAllProduceList()
        public
        view
        returns (Produce[] memory, int256 priceAdjustment)
    {
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

        priceAdjustment = this.adjustPriceByWeather();
        return (allProduces, priceAdjustment);
    }

    function getProduceList(
        address _farmer
    ) public view returns (Produce[] memory, int256 priceAdjustment) {
        require(farmers[_farmer], "Invalid farmer address");

        priceAdjustment = this.adjustPriceByWeather();
        return (produceList[_farmer], priceAdjustment);
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

    function purchaseProduce(
        address payable _farmer,
        uint256 _index
    ) public payable {
        require(
            buyers[msg.sender],
            "Only registered buyers can purchase produce"
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
        }

        produce.sold = true;
        removeSoldProduce(_farmer, _index);
        _farmer.transfer(msg.value);
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
        //Deleted the element at the index without modifying array len
        delete produces[_index];
    }

    function removeSoldProduce(address _farmer, uint256 _index) internal {
        Produce[] storage produces = produceList[_farmer];
        require(_index < produces.length, "Invalid produce index");
        //Deleted the element at the index without modifying array len
        delete produces[_index];
    }

    function setMarketPrice() public payable {
        require(
            buyers[msg.sender],
            "Only registered buyers can set market price"
        );

        marketPrices[msg.sender] = MarketPrice(msg.sender, msg.value);
        marketPriceVerified[msg.sender] = true;
    }

    // Chainlink Integration

    function getLocationWeather(
        address _oracle,
        string memory _jobId
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillLocationWeather.selector
        );

        req.add("path", "DailyForecasts,0,Temperature,Maximum,Value");

        return sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillLocationWeather(
        bytes32 _requestId,
        int256 _temp
    ) public recordChainlinkFulfillment(_requestId) {
        temperature = _temp;
    }

    function getTemperature() public view returns (int256) {
        return temperature;
    }

    function calculateAdjustedPrice(
        address _farmer,
        uint256 _index
    ) internal view returns (uint256) {
        uint256 originalPrice = produceList[_farmer][_index].price;
        uint256 truflationRate = truflationDataMap[_farmer].truflationRate;
        uint256 adjustedPrice = (originalPrice * truflationRate) / 100; // Adjust the price based on the truflation rate
        return adjustedPrice;
    }

    function sellProduceAtMarketPrice(address payable _buyer) public {
        Produce[] storage produces = produceList[msg.sender];
        MarketPrice storage buyerPrice = marketPrices[_buyer];

        uint256 totalCost = 0;

        for (uint256 i = 0; i < produces.length; i++) {
            Produce storage produce = produces[i];

            if (!produce.sold && produce.price <= buyerPrice.price) {
                totalCost += produce.price;
                removeSoldProduce(msg.sender, i);
                produce.sold = true;
            }
        }

        require(
            buyerPrice.price >= totalCost,
            "The buyer doesn't have enough balance to buy the produce"
        );

        int256 priceAdjustment = this.adjustPriceByWeather();
        int256 totalAdjustedPrice = int(totalCost) +
            (int(totalCost) / priceAdjustment);

        payable(msg.sender).transfer(uint(totalAdjustedPrice));
        buyerPrice.price -= uint(totalAdjustedPrice);
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

    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
