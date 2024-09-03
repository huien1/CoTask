ensures npm, ruby, xCode is installed <br>

navigate to a directory in terminal <br>
npx react-native init CoTask <br>

npm install --save react-native-vector-icons <br>
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view <br>
npm install @react-navigation/stack @react-navigation/native <br>
npm install react-native-sqlite-storage <br>
npm install react-native-ui-datepicker <br>
npm install react-native-select-dropdown <br>
npm i @react-native-community/checkbox <br>
npm i @react-native-async-storage/async-storage <br>
npm i react-native-document-picker <br>
npm i react-native-file-viewer <br>
npm install --save @notifee/react-native <br>
npm i react-native-gesture-handler <br>
npm i @testing-library/react-native <br>

cd ios
pod install

open ios/CoTask.xcworkspace

...add app icons...[1] <br>
cotask/cotask <br>
Create new group called "Fonts" <br>
add file node_module/react-native-vector-icons/Fonts/Octicons.ttf <br>

info.plist <br>
Add Fonts provided by application(array) <br>
Add Item 0: Octicons.ttf <br>

cd ios <br>
pod install <br> 
team sign in <br>

if there is multiple commands produce error, remove Octicons.ttf from app > build phases > copy bundle resources. <br>

Reference <br>
[1] Vimniky Luo (4 May 2016) How to use vector icons in your react native project [Online]. Available from: https://medium.com/@vimniky/how-to-use-vector-icons-in-your-react-native-project-8212ac6a8f06 [15 August 2024]




# CoTask
