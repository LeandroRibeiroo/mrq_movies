 # fail if any command fails
 echo "🧩 Stage: Post-clone is activated .... "

 # Install node
 echo "🎯 Stage: Installing node .... "
 brew install node

# Install yarn
 echo "🎯 Stage: Installing yarn .... "
 brew install yarn

 # Install cocoapods
 echo "🎯 Stage: Installing cocoapods .... "
 brew install cocoapods

   # Create .env file based on environment
echo "🎯 Stage: Creating .env file in the root folder .... "
cd ../..

# Check environment and create appropriate .env file
if [ "$ENVIRONMENT_NAME" = "DEVELOPMENT" ]; then
    echo "🎯 Creating .env.development file .... "
    ENV_FILE=".env.development"
elif [ "$ENVIRONMENT_NAME" = "PRODUCTION" ]; then
    echo "🎯 Creating .env.production file .... "
    ENV_FILE=".env.production"
else
    echo "⚠️  Unknown environment: $ENVIRONMENT_NAME. Defaulting to .env.local"
    ENV_FILE=".env.local"
fi

# Write environment variables to the appropriate file
echo "API_URL=$API_URL" > $ENV_FILE

 # Install js dependencies
 echo "🎯 Stage: Installing js dependencies .... "
 yarn

 # Install pod-install
 echo "🎯 Stage: Installing pod-install .... "
 npm install -g pod-install

 # Navigate to ios directory and install pods
 echo "🎯 Stage: Navigating to ios directory and installing pods .... "
 npx pod-install ios

 echo "🎯 Stage: Post-clone is done .... "

 exit 0