import { View, Text, TextInput, Button } from "react-native";

function Login({ navigation }) {
  return (
    <View>
      <Text>Sign Up or Sign In:</Text>
      <View>
        <TextInput placeholder="email" autoCapitalize="none" />
      </View>
      <View>
        <TextInput placeholder="password" secureTextEntry={true} />
      </View>
      <Button title="Sign In" />
      <Button title="Sign Up" />
    </View>
  );
}

export default Login;
