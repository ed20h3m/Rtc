// Import modules
const Joi = require("joi");

const UserSchema = Joi.object({
  Name: Joi.string().min(3).max(16).required(),
  Email: Joi.string().email().required(),
  Username: Joi.string().alphanum().min(3).max(16).required(),
  Password: Joi.string().min(8).max(32).required(),
  Verified: Joi.boolean().required(),
});
const UserSchemaPut = Joi.object({
  Name: Joi.string().min(3).max(16),
  Email: Joi.string().email(),
  Username: Joi.string().alphanum().min(3).max(16),
  Verified: Joi.boolean(),
});
const UserSchemaPassword = Joi.object({
  Password: Joi.string().min(3).max(16).required(),
});
const FriendShipSchema = Joi.object({
  Username: Joi.string().alphanum().min(3).max(16).required(),
});
const RequestSchema = Joi.object({
  Username: Joi.string().alphanum().min(3).max(16).required(),
  Request: Joi.boolean().required(),
  Cancel: Joi.boolean(),
});
const UserLoginSchema = Joi.object({
  EmailUsername: [
    Joi.string().email().required(),
    Joi.string().alphanum().min(3).max(16).required(),
  ],
  Password: Joi.string().min(8).max(32).required(),
});
module.exports = {
  UserSchema,
  UserSchemaPut,
  UserLoginSchema,
  UserSchemaPassword,
  FriendShipSchema,
  RequestSchema,
};
