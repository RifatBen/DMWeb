module.exports = { 
	IMAGE_PATH : "/home/rifat/Documents/PW6/DM/uploads/",
	postImg: function (req, res) {

        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let imageFile = req.files.kenzy;
        var imageFileName = req.files.kenzy.name

        imageFile.mv(IMAGE_PATH + imageFileName, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).json({ 'success': 'image uploaded' });
        });

    }



}