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
    }

    struct MarketPrice {
        address buyer;
        uint256 price;
    }

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
        farmers[msg.sender] = true;
    }

    function registerAsBuyer() public {
        buyers[msg.sender] = true;
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

    function getProduceList(
        address _farmer
    ) public view returns (Produce[] memory) {
        require(farmers[_farmer], "Invalid farmer address");
        return produceList[_farmer];
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
}
