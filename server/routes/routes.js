const mysql = require('../config/mysql');

module.exports = (app) => {

   //==================================================================================
   // Browse
   app.get('/', async (req, res, next) => {
      let db = await mysql.connect();

      let [tracks] = await db.execute('SELECT tracks.id as id, title, artists.name as artist, cover, topoftheweek, alltimehits FROM tracks INNER JOIN artists ON artists.id = fk_artist');

      db.end();

      res.render('browse', {
         "tracks": tracks,
         "page": "browse",
      });
   });

   //==================================================================================
   // All tracks
   app.get('/alltracks', async (req, res, next) => {
      let db = await mysql.connect();

      let [tracks] = await db.execute('SELECT tracks.id as id, title, artists.name as artist, cover, topoftheweek, alltimehits FROM tracks INNER JOIN artists ON artists.id = fk_artist');

      db.end();

      res.render('all-tracks', {
         "tracks": tracks,
         "page": "alltracks",
      });
   });

   //==================================================================================
   // Playlist
   app.get('/playlist/:playlist_id', async (req, res, next) => {
      let db = await mysql.connect();

      let [playlists] = await db.execute('SELECT * from playlists');

      let [playlistTracks] = await db.execute('SELECT playlist_manager.id as id, tracks.title as track, playlist_manager.fk_playlist as playlist, artists.name as artist, tracks.id as trackid FROM `playlist_manager` INNER JOIN tracks ON tracks.id = fk_track INNER JOIN artists ON artists.id = tracks.fk_artist WHERE playlist_manager.fk_playlist = ?', [req.params.playlist_id]);

      db.end();

      res.render('playlist', {
         "playlists": playlists,
         "playlistTracks": playlistTracks,
         "currentPlaylist": req.params.playlist_id,
         "page": "playlist",
      });
   });

   //==================================================================================
   // Player
   app.get('/player/:track_id', async (req, res, next) => {
      let db = await mysql.connect();

      let [playlists] = await db.execute('SELECT * from playlists');

      let [playlistTracks] = await db.execute('SELECT playlist_manager.id as id, tracks.title as track, playlist_manager.fk_playlist as playlist, artists.name as artist, tracks.cover as cover, tracks.id as trackid FROM `playlist_manager` INNER JOIN tracks ON tracks.id = fk_track INNER JOIN artists ON artists.id = tracks.fk_artist WHERE tracks.id = ?', [req.params.track_id]);

      db.end();

      res.render('player', {
         "playlists": playlists,
         "playlistTracks": playlistTracks[0],
         "track_id": req.params.track_id,
      });
   });

   //==================================================================================
   // Login
   app.get('/login', (req, res, next) => {
      console.log(req.session.user_id)

      res.render('login', {

      });
   });

   app.post('/login', async (req, res, next) => {

      let doLogin = true;
      let username = req.body.username;
      let password = req.body.password;

      console.log(username)

      if (username == undefined || username == '') {
         doLogin = false;
         console.log("Error");
      }
      if (password == undefined || password == '') {
         doLogin = false;
         console.log("Error");
      }

      if (doLogin) {
         let db = await mysql.connect();
         let [user] = await db.execute('SELECT * FROM user WHERE user.username = ? AND user.password = ?', [username, password]);
         db.end();

         if (user.length > 0) {
            req.session.user_id = user.id;
            res.redirect('/');
         } else {
            res.send("Error")
         }
      }

   });

   //==================================================================================
   // Search

   app.get('/search', async (req, res, next) => {
      let db = await mysql.connect();

      let [tracks] = await db.execute('SELECT tracks.id as id, title, artists.name as artist FROM tracks INNER JOIN artists ON artists.id = fk_artist');

      db.end();

      res.render('search', {
         "tracks": tracks,
         "page": "search",
      });
   });

   app.post('/search', async (req, res, next) => {
      let searchinput = req.body.searchinput;
      res.redirect(`/search/${searchinput}`);
   });

   app.get('/search/:search', async (req, res, next) => {
      let db = await mysql.connect();

      let [tracks] = await db.execute('SELECT tracks.id as id, title, artists.name as artist FROM tracks INNER JOIN artists ON artists.id = fk_artist WHERE tracks.title LIKE ? OR artists.name LIKE ?', ['%' + req.params.search + '%', '%' + req.params.search + '%']);

      db.end();

      res.render('search', {
         "tracks": tracks,
         "page": "search",
      });
   });

   app.post('/search/:search', async (req, res, next) => {
      let searchinput = req.body.searchinput;
      res.redirect(`/search/${searchinput}`);
   });


};