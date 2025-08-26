const SocialAccount = require("../models/SocialAccount");

exports.getSocialAccount = async (req, res) => {
    const socialAccount = await SocialAccount.findAll();
    res.json(socialAccount);
};

exports.createSocialAccount = async (req,res) =>{
    try {
        const {platform,clientId,clientSecret,accessToken,refreshToken,expiresAt,pageId,channelId,extraData} = req.body;

        const socialAccount = await SocialAccount.create({platform,clientId,clientSecret,accessToken,refreshToken,expiresAt,pageId,channelId,extraData});
        res.status(201).json(socialAccount);
        
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.updateSocialAccount = async (req,res) => {
    try {
        const {id} = req.params;
        const {platform,clientId,clientSecret,accessToken,refreshToken,expiresAt,pageId,channelId,extraData} = req.body;
        const socialAccount = await SocialAccount.update({platform,clientId,clientSecret,accessToken,refreshToken,expiresAt,pageId,channelId,extraData},{where:{id}});
        res.status(200).json(socialAccount);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteSocialAccount = async (req,res) => {
    try {
        const {id} = req.params;
        const socialAccount = await SocialAccount.destroy({where:{id}});
        res.status(200).json(socialAccount);
    } catch (error) {
        res.status(500).json(error);
    }
}




