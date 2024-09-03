
import 'react-native-gesture-handler/jestSetup';

jest.mock('@notifee/react-native', () => {
    const notifee = {
        getInitialNotification: jest.fn().mockResolvedValue(null),
        displayNotification: jest.fn().mockResolvedValue(),
        onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
        onBackgroundEvent: jest.fn(),
        createChannelGroup: jest.fn().mockResolvedValue('channel-group-id'),
        createChannel: jest.fn().mockResolvedValue(),
    };

    return ({
        ...jest.requireActual('@notifee/react-native/dist/types/Notification'),
        __esModule: true,
        default: notifee,
    });
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-document-picker', () => ({ default: jest.fn(), }));


jest.mock('react-native-sqlite-storage/lib/sqlite.core');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);









