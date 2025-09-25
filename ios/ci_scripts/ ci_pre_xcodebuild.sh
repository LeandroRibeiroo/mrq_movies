#!/bin/zsh

echo "🧩 Stage: PRE-Xcode Build is activated .... "

echo "🎯 Stage: Building XCConfig .... "

echo "🎯 Stage: Navigating to the root folder of the project .... "
cd ../..

echo "🎯 Stage: Building XCConfig .... "
./node_modules/react-native-config/ios/ReactNativeConfig/BuildXCConfig.rb ./ ./tmp.xcconfig

echo "🎯 Stage: PRE-Xcode Build is DONE .... "

exit 0