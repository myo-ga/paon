const config = require('config');

function validateCandidate(candidate) {
    switch (candidate) {
        case config.get('member.candidate.None'):
        case config.get('member.candidate.OK'):
        case config.get('member.candidate.NG'):
        case config.get('member.candidate.UnKnown'):
            return true;
        default:
            return false;
    }
}


module.exports = {
    validateCandidate
};