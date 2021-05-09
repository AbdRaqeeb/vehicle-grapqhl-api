import { gql } from 'apollo-server-express';

export default gql`
  type VehicleStatus {
    bike_id: String
    lat: Float
    lon: Float
    is_reserved: Int
    is_disabled: Int
    vehicle_type: String
  }

  type User {
    id: String
    first_name: String
    last_name: String
    email: String
    password: String
    created_at: String
    updated_at: String
  }

  type UserToken {
    token: String
    user: User
  }

  type Query {
    vehicle(bike_id: String): [VehicleStatus]
  }

  type Mutation {
    register(first_name: String!, last_name: String!, email: String!, password: String!): UserToken!

    login(email: String, password: String): UserToken!
  }
`;
