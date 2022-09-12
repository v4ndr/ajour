/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const Users = require('../models/Users');
const Mangas = require('../models/Mangas');

exports.load = async (req, res) => {
  const { username } = req.query;

  const user = await Users.getUserInfos(username);

  const friends = [];
  for (const friend of user.friends) {
    friends.push(Users.getUserInfos(friend));
  }

  const receivedFriendRequests = await Users.getReceivedFriendsRequests(username);
  const sentFriendRequests = await Users.getSentFriendsRequests(username);

  const followedMangasName = Object.keys(user.mangas);
  const followedMangas = [];
  for (const mangaName of followedMangasName) {
    followedMangas.push(Mangas.getMangaInfos(mangaName));
  }

  const allMangasName = await Mangas.getAllMangasNames();

  const usersInfosPerManga = {};
  Promise.all(friends).then((friends) => {
    const friendsDisplayInfos = {};
    // eslint-disable-next-line guard-for-in
    for (const friend of friends) {
      friendsDisplayInfos[friend.name] = {
        avatar: friend.avatar,
      };
    }
    Promise.all(followedMangas).then((followedMangas) => {
      for (const manga of followedMangas) {
        const friendsAndMe = [...friends, user];
        const friendsWhoReadIt = friendsAndMe.reduce((acc, friend) => {
          if (manga.name in friend.mangas) {
            const friendCpy = {};
            friendCpy.name = friend.name;
            friendCpy.numberToRead = manga.lastCh - friend.mangas[manga.name].progress;
            friendCpy.progress = friend.mangas[manga.name].progress;
            acc.push(friendCpy);
            return acc;
          }
          return acc;
        }, []);
        usersInfosPerManga[manga.name] = friendsWhoReadIt;
      }
      res.status(200).json({
        user,
        usersInfosPerManga,
        followedMangas,
        allMangasName,
        friends: friendsDisplayInfos,
        receivedFriendRequests,
        sentFriendRequests,
      });
    });
  });
};
