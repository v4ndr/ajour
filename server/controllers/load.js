/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const Users = require('../models/Users');
const Mangas = require('../models/Mangas');

exports.load = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    res.status(400).json({ error: 'Missing username' });
  } else {
    const user = Users.getUserInfos(username);
    const allMangasName = Mangas.getAllMangasNames();
    const receivedFriendRequests = Users.getReceivedFriendsRequests(username);
    const sentFriendRequests = Users.getSentFriendsRequests(username);

    Promise.all([user, allMangasName, receivedFriendRequests, sentFriendRequests])
      .then((values) => {
        const [user, allMangasName, receivedFriendRequests, sentFriendRequests] = values;
        const followedMangasName = Object.keys(user.mangas);
        const friends = [];
        const followedMangas = [];
        const usersInfosPerManga = {};
        const friendsDisplayInfos = {};

        for (const friend of user.friends) {
          friends.push(Users.getUserInfos(friend));
        }
        for (const mangaName of followedMangasName) {
          followedMangas.push(Mangas.getMangaInfos(mangaName));
        }

        Promise.all(friends)
          .then((friends) => {
            for (const friend of friends) {
              friendsDisplayInfos[friend.name] = {
                avatar: friend.avatar,
              };
            }
            Promise.all(followedMangas)
              .then((followedMangas) => {
                for (const manga of followedMangas) {
                  const friendsAndMe = [...friends, user];
                  const usersWhoReadIt = friendsAndMe.reduce((acc, friend) => {
                    if (manga in friend.mangas) {
                      const friendCpy = {};
                      friendCpy.name = friend.name;
                      friendCpy.numberToRead = manga.lastCh - friend.mangas[manga.name].progress;
                      friendCpy.progress = friend.mangas[manga.name].progress;
                      acc.push(friendCpy);
                      return acc;
                    }
                    return acc;
                  }, []);
                  usersInfosPerManga[manga.name] = usersWhoReadIt;
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
              })
              .catch((err) => {
                res.status(400).json(`load failed, error in getting mangas infos : ${err.message}`);
              });
          })
          .catch((err) => {
            res.status(400).json(`load failed, error in getting friends infos : ${err.message}`);
          });
      })
      .catch((err) => {
        res.status(400).json(`load failed, error in getting request, user or allmangas infos : ${err.message}`);
      });
  }
};
