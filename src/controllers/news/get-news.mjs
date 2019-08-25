import lodash from "lodash";
import { getAllNews } from "../../models/news/index.mjs";
import { getUserFromDbById } from "../../models/users/index.mjs";
import { userDataSerializer } from "../../utils/serializers/users/index.mjs";

// func to execute news from db
export const getNewsFromDB = async () => {
  const { pick } = lodash;
  const news = await getAllNews();

  const result = news.map(async item => {
    const userId = item.userId;
    const newsData = pick(item, ["theme", "date", "text"]);
    const userData = await getUserFromDbById(userId);
    console.log("additional test user data", userData, userId);

    const serializedUserData = userDataSerializer(userData);

    if (userData && userData.username) {
      const { password = "", ...restUserData } = serializedUserData;

      return {
        ...newsData,
        id: item._id,
        user: {
          ...restUserData
        }
      };
    }
  });

  const newsResult = await Promise.all(result);

  return newsResult;
};
