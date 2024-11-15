const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ListingContract", function () {

  async function deployListingFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

  
    const ListingContract = await ethers.getContractFactory("ListingContract");
    const listing = await ListingContract.deploy(owner.address);

    return { listing, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { listing, owner } = await loadFixture(deployListingFixture);
      expect(await listing.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero items", async function () {
      const { listing } = await loadFixture(deployListingFixture);
      expect(await listing.itemCount()).to.equal(0);
    });
  });

  describe("Listings", function () {
    describe("Validations", function () {
      it("Should revert when non-owner tries to list item", async function () {
        const { listing, otherAccount } = await loadFixture(deployListingFixture);

        await expect(
          listing.connect(otherAccount).listItem("Test Item", ethers.parseEther("1"))
        ).to.be.revertedWith("Not authorized");
      });

      it("Should allow owner to list item", async function () {
        const { listing, owner } = await loadFixture(deployListingFixture);

        await expect(
          listing.connect(owner).listItem("Test Item", ethers.parseEther("1"))
        ).to.not.be.reverted;
      });
    });

    describe("Item Creation", function () {
      it("Should create item with correct properties", async function () {
        const { listing, owner } = await loadFixture(deployListingFixture);
        
        const itemName = "Test Item";
        const itemPrice = ethers.parseEther("1");
        
        await listing.connect(owner).listItem(itemName, itemPrice);
        
        const item = await listing.items(1);
        expect(item.name).to.equal(itemName);
        expect(item.price).to.equal(itemPrice);
        expect(item.active).to.be.true;
      });

      it("Should increment item count correctly", async function () {
        const { listing, owner } = await loadFixture(deployListingFixture);
        
        await listing.connect(owner).listItem("Item 1", ethers.parseEther("1"));
        expect(await listing.itemCount()).to.equal(1);
        
        await listing.connect(owner).listItem("Item 2", ethers.parseEther("2"));
        expect(await listing.itemCount()).to.equal(2);
      });
    });

    describe("Events", function () {
      it("Should emit ItemListed event with correct parameters", async function () {
        const { listing, owner } = await loadFixture(deployListingFixture);
        
        const itemName = "Test Item";
        const itemPrice = ethers.parseEther("1");
        
        await expect(listing.connect(owner).listItem(itemName, itemPrice))
          .to.emit(listing, "ItemListed")
          .withArgs(1, itemName, itemPrice);
      });
    });

    describe("Item Retrieval", function () {
      it("Should return correct item details", async function () {
        const { listing, owner } = await loadFixture(deployListingFixture);
        
        const itemName = "Test Item";
        const itemPrice = ethers.parseEther("1");
        
        await listing.connect(owner).listItem(itemName, itemPrice);
        
        const item = await listing.items(1);
        expect(item.name).to.equal(itemName);
        expect(item.price).to.equal(itemPrice);
        expect(item.active).to.be.true;
      });

      it("Should return empty values for non-existent items", async function () {
        const { listing } = await loadFixture(deployListingFixture);
        
        const item = await listing.items(1);
        expect(item.name).to.equal("");
        expect(item.price).to.equal(0);
        expect(item.active).to.be.false;
      });
    });
  });
});