import { ValidationError, AuthenticationError } from 'apollo-server-express';
import { User } from '../database/models/User';
import axios from 'axios';

interface UserInput {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
}

interface LoginInput {
  password: string;
  email: string;
}

interface UserToken {
  token: string;
  user: User;
}

interface VehicleInput {
  bike_id?: string;
}

interface Vehicle {
  bike_id: string;
  lat: number;
  lon: number;
  is_reserved: number;
  is_disabled: number;
  vehicle_type: string;
}

export default {
  Query: {
    async vehicle(_: void, { bike_id }: VehicleInput, context: any): Promise<Vehicle[]> {
      if (!context.isAuth) {
        throw new AuthenticationError('User has no access to this route');
      }

      const result = await axios.get(`${process.env.URL}`);

      let bikes;

      if (bike_id) {
        bikes = result.data.data.bikes.filter((item) => item.bike_id === bike_id);
        return bikes;
      }

      bikes = result.data.data.bikes;
      return bikes;
    },
  },

  Mutation: {
    async register(_: void, { first_name, last_name, email, password }: UserInput): Promise<UserToken> {
      let user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        throw new ValidationError('User with the email exists');
      }

      user = await User.create({
        first_name,
        last_name,
        email,
        password,
      });

      const token = user.getSignedJwtToken();

      return { token, user };
    },

    async login(_: void, { email, password }: LoginInput): Promise<UserToken> {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new ValidationError('Invalid email/password');
      }

      const check = await user.matchPassword(password);

      if (!check) {
        throw new ValidationError('Invalid email/password');
      }

      const token = user.getSignedJwtToken();

      return { token, user };
    },
  },
};
