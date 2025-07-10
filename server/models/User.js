import Sequelize from "sequelize";
import { Model } from "sequelize";

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                username: {
                    type: Sequelize.STRING,
                    unique: true
                },
                password: Sequelize.STRING,
                wallet_address: Sequelize.STRING,
                balance: Sequelize.STRING,
            },
            {
                sequelize,
                tableName: "users",
                timestamps: false
            }
        );

        return this;
    }

    static associate(models) {

    }
}

export default User;
