// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CropLink {
    address payable public treasury;
    uint256 public treasuryBalance;

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

    address[] public farmerAddresses;
    address[] public buyerAddresses;

    mapping(address => bool) public farmers;
    mapping(address => bool) public buyers;
    mapping(address => bool) public farmerVerifications;
    mapping(address => bool) public buyerVerifications;
    mapping(address => Produce[]) public produceList;
    mapping(address => MarketPrice) public marketPrices;
    mapping(address => bool) public marketPriceVerified;

    constructor() {
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
        produceList[msg.sender].push(Produce(_name, _quantity, _price, false, index, msg.sender));
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

    function purchaseProduce(address payable _farmer, uint256 _index) public payable {
        require(
            buyers[msg.sender],
            "Only registered buyers can purchase produce"
        );
        // require(
        //     buyerVerifications[msg.sender],
        //     "Only verified buyers can purchase produce"
        // );
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
            require(msg.value >= produce.price * produce.quantity, "Incorrect amount of funds");
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

    function setMarketPrice(uint256 _price) public {
        require(
            buyers[msg.sender],
            "Only registered buyers can set market price"
        );
        marketPrices[msg.sender] = MarketPrice(msg.sender, _price);
        marketPriceVerified[msg.sender] = true;
    }
}

