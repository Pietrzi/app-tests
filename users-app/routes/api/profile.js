
const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

router.post(
    '/',
    [
      auth,
      [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;
  
      const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
        bio,
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => ' ' + skill.trim()),
        status,
        githubusername
      };
  
      // Build social object and add to profileFields
      const socialfields = { youtube, twitter, instagram, linkedin, facebook };
  
      for (const [key, value] of Object.entries(socialfields)) {
        if (value && value.length > 0)
          socialfields[key] = normalize(value, { forceHttps: true });
      }
      profileFields.social = socialfields;
  
      try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true }
        );
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

  module.exports = router;