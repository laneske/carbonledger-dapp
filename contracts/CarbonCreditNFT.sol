// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CarbonCreditNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    struct CarbonCreditMetadata {
        string projectId;
        string projectType;
        string certificationStandard;
        uint256 vintageYear;
        uint256 co2Tons;
        string geographicLocation;
        string uri;
    }
    
    mapping(uint256 => CarbonCreditMetadata) public carbonCreditData;
    
    event CarbonCreditMinted(
        uint256 indexed tokenId,
        address indexed to,
        string projectId,
        uint256 co2Tons
    );
    
    event CarbonCreditRetired(
        uint256 indexed tokenId,
        address indexed by,
        string retirementReason
    );
    
    constructor() ERC721("CarbonCreditNFT", "CCNFT") {}
    
    function mintCarbonCredit(
        address to,
        string memory projectId,
        string memory projectType,
        string memory certificationStandard,
        uint256 vintageYear,
        uint256 co2Tons,
        string memory geographicLocation,
        string memory metadataUri
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _mint(to, tokenId);
        
        carbonCreditData[tokenId] = CarbonCreditMetadata({
            projectId: projectId,
            projectType: projectType,
            certificationStandard: certificationStandard,
            vintageYear: vintageYear,
            co2Tons: co2Tons,
            geographicLocation: geographicLocation,
            uri: metadataUri
        });
        
        emit CarbonCreditMinted(tokenId, to, projectId, co2Tons);
        
        return tokenId;
    }
    
    function retireCarbonCredit(uint256 tokenId, string memory retirementReason) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        
        emit CarbonCreditRetired(tokenId, _msgSender(), retirementReason);
        
        _burn(tokenId);
        
        delete carbonCreditData[tokenId];
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        CarbonCreditMetadata memory data = carbonCreditData[tokenId];
        
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            '{"name":"Carbon Credit #', toString(tokenId), '",',
            '"description":"Tokenized Carbon Credit representing ', toString(data.co2Tons), ' tons of CO2 reduction",',
            '"image":"https://example.com/carbon-credit.png",',
            '"attributes":[',
            '{"trait_type":"Project Type","value":"', data.projectType, '"},',
            '{"trait_type":"Certification","value":"', data.certificationStandard, '"},',
            '{"trait_type":"Vintage Year","value":', toString(data.vintageYear), '},',
            '{"trait_type":"CO2 Tons","value":', toString(data.co2Tons), '},',
            '{"trait_type":"Location","value":"', data.geographicLocation, '"}',
            ']}'
        ));
    }
    
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
