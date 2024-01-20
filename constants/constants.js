module.exports = {
  // Responses
  RESPONSE_200: "OK",
  RESPONSE_400: "Bad Request",
  RESPONSE_401: "Unauthorized",
  RESPONSE_403: "Forbidden",
  RESPONSE_404: "Not Found",
  RESPONSE_500: "Internal Server Error",
  // Error
  INVALID_ENDPOINT: "Invalid endpoint",
  INVALID_TOKEN: "Invalid token",
  INVALID_ID: "Invalid ID",
  INVALID_ID_NULL: "Invalid ID. ID shouldn't be null",
  INVALID_ACCESS_DENIED: "Access denied",
  DATA_DELETED: "Data has been deleted",
  // Auth
  ERROR_USER_AGENT_NULL: "User Agent cannot be null",
  // Login
  LOGIN_FAILURE_INVALID_EMAIL:
    "Invalid credentials. This email is not registered",
  LOGIN_FAILURE_INVALID_PASSWORD: "Wrong password",
  LOGIN_SUCCESS: "Login success",
  //  Register
  REGISTER_SUCCESS: "Account successfully created",
  REGISTER_FAILURE_UNIQUE_EMAIL: "This email is already registered",
  REGISTER_FAILURE_UNIQUE_USERNAME: "This username is already registered",
  // Personality Info
  PERSONALITY_INFO_CREATE_SUCCESS:
    "Personality information created successfully",
  PERSONALITY_INFO_CREATE_FAILURE: "Personality information create failure",
  PERSONALITY_INFO_CREATE_FAILURE_ALREADY_EXIST:
    "Personality with these name is alreay exist",
  PERSONALITY_INFO_UPDATE_SUCCESS:
    "Personality information updated successfully",
  PERSONALITY_INFO_UPDATE_FAILURE: "Personality information update failure",
  PERSONALITY_INFO_DELETE_SUCCESS:
    "Personality information deleted successfully",
  PERSONALITY_INFO_DELETE_FAILURE: "Personality information delete failure",
  PERSONALITY_INFO_NOT_FOUND: "Personality information not found",
  // Radio Info
  RADIO_INFO_CREATE_SUCCESS: "Radio Information created successfully",
  RADIO_INFO_CREATE_FAILURE: "Radio Information create failure",
  RADIO_INFO_CREATE_FAILURE_ALREADY_EXIST:
    "Radio information with these name is alreay exist",
  RADIO_INFO_UPDATE_SUCCESS: "Radio Information updated successfully",
  RADIO_INFO_UPDATE_FAILURE: "Radio Information update failure",
  RADIO_INFO_DELETE_SUCCESS: "Radio Information deleted successfully",
  RADIO_INFO_DELETE_FAILURE: "Radio Information delete failure",
  RADIO_INFO_NOT_FOUND: "Radio Information not found",
  // Radio Tracks
  RADIO_TRACKS_CREATE_SUCCESS: "Radio Tracks created successfully",
  RADIO_TRACKS_CREATE_FAILURE: "Radio Tracks create failure",
  RADIO_TRACKS_CREATE_FAILURE_ALREADY_EXIST:
    "Radio track with these name is alreay exist",
  RADIO_TRACKS_UPDATE_SUCCESS: "Radio Tracks updated successfully",
  RADIO_TRACKS_UPDATE_FAILURE: "Radio Tracks update failure",
  RADIO_TRACKS_DELETE_SUCCESS: "Radio Tracks deleted successfully",
  RADIO_TRACKS_DELETE_FAILURE: "Radio Tracks delete failure",
  RADIO_TRACKS_NOT_FOUND: "Radio Tracks not found",
  // Personalities
  PERSONALITIES_SUCCESS_CREATED: "Personalities has been assigned",
  PERSONALITIES_SUCCESS_UPDATED: "Personalities has been updated",
  PERSONALITIES_FAILURE_NOT_FOUND: "Personalities not found",
  PERSONALITIES_FAILURE_EXISTS: "This Personalities is already assigned",
  PERSONALITIES_FAILURE_UPDATE: "Personalities cannot be updated",
  // User
  USER_CREATE_SUCCESS: "User created successfully",
  USER_CREATE_FAILURE: "User create failure",
  USER_UPDATE_SUCCESS: "Your data has been updated",
  USER_UPDATE_PASSWORD_SUCCESS: "Your password has been changed",
  USER_UPDATE_FAILURE: "Error occured. Failed to update your data",
  USER_DELETE_SUCCESS: "User deleted successfully",
  USER_DELETE_FAILURE: "User delete failure",
  USER_NOT_FOUND: "User not found",
  // Users favorite personality
  USER_FAVORITE_PERSONALITY_EXIST:
    "This personality is already in your favorites",
  USER_FAVORITE_PERSONALITY_SUCCESS_ADD:
    "This personality successfully added into favorites",
  USER_FAVORITE_PERSONALITY_SUCCESS_DELETE:
    "This personality successfully deleted from your favorites",
  USER_FAVORITE_PERSONALITY_NOT_FOUND:
    "You didn't have any favorite personalities",
  // Users favorite radio info
  USER_FAVORITE_RADIO_INFO_EXIST:
    "This radio info is already in your favorites",
  USER_FAVORITE_RADIO_INFO_SUCCESS_ADD:
    "This radio info successfully added into favorites",
  USER_FAVORITE_RADIO_INFO_SUCCESS_DELETE:
    "This radio info successfully deleted from your favorites",
  USER_FAVORITE_RADIO_INFO_FAILURE_DELETE_NOT_FOUND:
    "The radio you want to delete from your favorites is not found",
  USER_FAVORITE_RADIO_INFO_NOT_FOUND: "You didn't have any favorite radio",
  // Users favorite radio tracks
  USER_FAVORITE_RADIO_TRACKS_EXIST:
    "This radio tracks is already in your favorites",
  USER_FAVORITE_RADIO_TRACKS_SUCCESS_ADD:
    "This radio tracks successfully added into favorites",
  USER_FAVORITE_RADIO_TRACKS_SUCCESS_DELETE:
    "This radio tracks successfully deleted from your favorites",
  USER_FAVORITE_RADIO_TRACKS_NOT_FOUND:
    "You didn't have any favorite radio tracks",
};
