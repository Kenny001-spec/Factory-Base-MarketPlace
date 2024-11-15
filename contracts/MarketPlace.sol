// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./IListing.sol";
import "./MarketPlaceFactory.sol";

contract ListingContract {
    address public owner;
    
    struct Item {
        string name;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Item) public items;
    uint256 public itemCount;
    
    event ItemListed(uint256 indexed id, string name, uint256 price);
    
    constructor(address _owner) {
        owner = _owner;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function listItem(string calldata _name, uint256 _price) external onlyOwner {
        itemCount++;
        items[itemCount] = Item(_name, _price, true);
        emit ItemListed(itemCount, _name, _price);
    }
}
