// contracts/NFTMarketplace.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    struct Listing {
        address seller;
        uint256 price;
        address nftContract;
        uint256 tokenId;
    }

    mapping(uint256 => Listing) public listings;

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, price, nftContract, tokenId);
    }

    function buyNFT(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(msg.value >= listing.price, "Not enough funds");
        payable(listing.seller).transfer(listing.price);
        IERC721(listing.nftContract).transferFrom(address(this), msg.sender, tokenId);
        delete listings[tokenId];
    }
}