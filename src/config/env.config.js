import dotenv from "dotenv";

// cargo las variables del archivo .env al objeto process.env

dotenv.config();

const requiredEnvs = ['PORT', 'NODE_ENV'];
const missingEnvs = [];

// valido que existan PORT y NODE_ENV en el objeto process.env
requiredEnvs.forEach((envName) => {
      if(!process.env[envName]){
            missingEnvs.push(envName);
        }
    });


if(missingEnvs.length > 0){
    console.error(`Error critico: faltan las sguientes variables ${missingEnvs.join(', ')}`);
    process.exit(1);
}

export const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV
};

