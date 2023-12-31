import {DataTypes, Sequelize} from 'sequelize';
import {Member, Event, Participation, Schools} from "./Models";
import * as fs from "fs";
require('dotenv').config();


const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.DATABASE_PORT),
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync("./ca.pem").toString()
        }
    }
});

export function connectDb() : void {
    sequelize.authenticate().then(() => {
        console.log("Connected to database");
    }).catch((error) => {
        console.error(error);
    });
}

export async function createTables(){
    Member.init({
        memberId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        memberLastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        memberFirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        memberEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        memberPassword: {
            type: DataTypes.STRING,
            allowNull: false
        },
        memberSchool: {
            type: DataTypes.ENUM("ESILV", "IIM", "EMLV"),
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, { sequelize, tableName: "Member" });

    Event.init({
        eventId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        eventTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventType: {
            type: DataTypes.ENUM("Tournament", "Training", "Event"),
            allowNull: false
        },
        eventLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eventDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        eventLimit: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { sequelize, tableName: "Event" });

    Participation.init({
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Event,
                key: 'eventId'
            }
        },
        memberId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Member,
                key: 'memberId'
            }
        }
    }, { sequelize, tableName: "Participation" });

    await Member.sync({force: false});
    console.log("Member table created");

    await Event.sync({force: false});
    console.log("Event table created");

    await Participation.sync({force: false});
    console.log("Participation table created");

}
