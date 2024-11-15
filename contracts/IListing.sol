
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

interface IListing {
    function listItem(
        uint256 itemId,
        string memory itemName,
        uint256 itemPrice
    ) external;
}
