// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ListingContract} from "./MarketPlace.sol";
contract MarketplaceFactory {

    mapping(address => address) public userListings;
    

    address[] public users;
    

    event UserRegistered(address indexed user, address listingContract);
    

    function createListing() external returns (address) {
      
        require(userListings[msg.sender] == address(0), "User already registered");
        
 
        ListingContract newListing = new ListingContract(msg.sender);
        
      
        userListings[msg.sender] = address(newListing);
        users.push(msg.sender);
        
       
        emit UserRegistered(msg.sender, address(newListing));
        
        return address(newListing);
    }
    
   
    function getUserListing(address user) external view returns (address) {
        return userListings[user];
    }
    
 
    function getTotalUsers() external view returns (uint256) {
        return users.length;
    }
}
