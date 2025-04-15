const getUserProfile = (req, res) => {
    res.json({ message: 'User profile data working' });
};

module.exports = { getUserProfile };