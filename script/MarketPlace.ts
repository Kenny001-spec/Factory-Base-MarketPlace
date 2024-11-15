
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
 
  const deployments = require("./deployments.json");
  

  const MarketplaceFactory = await ethers.getContractFactory("MarketplaceFactory");
  const ListingContract = await ethers.getContractFactory("ListingContract");
  

  const marketplaceFactory = MarketplaceFactory.attach(deployments.MarketplaceFactory);
  
 
  const [owner, user1, user2] = await ethers.getSigners();
  
  console.log("Interacting with contracts using accounts:");
  console.log("Owner:", owner.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);

  try {
 
    console.log("\nUser1 creating a listing...");
    const createTx = await marketplaceFactory.connect(user1).createListing();
    const createReceipt = await createTx.wait();
    
  
    const userRegisteredEvent = createReceipt.logs.find(
      log => log.topics[0] === marketplaceFactory.interface.getEventTopic('UserRegistered')
    );
    const decodedEvent = marketplaceFactory.interface.decodeEventLog(
      'UserRegistered',
      userRegisteredEvent.data,
      userRegisteredEvent.topics
    );
    
    const listingAddress = decodedEvent[1];
    console.log("Listing contract created at:", listingAddress);

  
    const listingContract = ListingContract.attach(listingAddress);

    console.log("\nUser1 creating items...");
    await listingContract.connect(user1).createListing(
      "Item 1",
      "First item description",
      ethers.parseEther("0.1")
    );
    
    await listingContract.connect(user1).createListing(
      "Item 2",
      "Second item description",
      ethers.parseEther("0.2")
    );

    console.log("\nFetching active listings...");
    const activeListings = await listingContract.getActiveListings();
    console.log("Active listings:", activeListings);

  
    console.log("\nUser2 purchasing Item 1...");
    await listingContract.connect(user2).purchaseItem(1, {
      value: ethers.parseEther("0.1")
    });


    console.log("\nFetching updated listings...");
    const updatedListings = await listingContract.getActiveListings();
    console.log("Updated listings:", updatedListings);

 
    const totalUsers = await marketplaceFactory.getTotalUsers();
    console.log("\nTotal registered users:", totalUsers);

  } catch (error) {
    console.error("Error during interaction:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });