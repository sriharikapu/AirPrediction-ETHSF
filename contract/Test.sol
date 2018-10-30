pragma solidity ^0.4.23;

contract Oracle {
    bool public finalized;
    bool public result;

    function setFinalize(bool _finalized) {
        finalized = _finalized;
    }
    
    function setResult(bool _result) {
        result = _result;
    }
    
    function isFinalized(bytes _query, uint _timeout) public view returns (bool) {
        return finalized;
    }

    function queryResult(bytes _query) public view returns (bool) {
        return result;
    }
}
