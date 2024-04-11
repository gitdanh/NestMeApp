import { Text } from "react-native";

const renderMentionLink = (content, navigator, authUsername = "") => {
  const mentionRegex = /@([\w.]+)/g;
  const mentions = content.match(mentionRegex);

  const onPressMentionHandler = (usernameMention) => {
    navigator.navigate(
      authUsername === usernameMention ? "Profile" : "OtherProfile",
      {
        isOwnProfile: authUsername === usernameMention ? true : false,
        username: usernameMention,
      }
    );
  };

  if (!mentions) {
    return <Text>{content}</Text>;
  }

  const renderedContent = content.split(mentionRegex).map((part, index) => {
    if (index % 2 === 0) {
      return <Text key={index}>{part}</Text>;
    } else {
      const username = part.slice(0, part.length);
      const isValidUsername = /^[\w._]+$/.test(username);

      if (isValidUsername) {
        return (
          <Text
            key={index}
            style={{
              color: "#E0F1FF",
              fontWeight: "500",
            }}
            onPress={onPressMentionHandler.bind(this, [username])}
          >
            @{username}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    }
  });

  return <>{renderedContent}</>;
};

export default renderMentionLink;
