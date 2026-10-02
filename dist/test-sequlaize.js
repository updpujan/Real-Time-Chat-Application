import 'dotenv/config';
import sequelize from './config/database.js';
import User from './models/users.js';
const findUser = async () => {
    await sequelize.authenticate();
    const findUser = await User.findOne({
        where: {
            email: 'updpujan1@gmail.com',
        },
    });
    console.log(findUser?.toJSON());
};
findUser();
//# sourceMappingURL=test-sequlaize.js.map