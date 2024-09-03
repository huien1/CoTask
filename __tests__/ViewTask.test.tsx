import ViewTask from '../pages/viewTask';
import { render, screen, fireEvent } from '@testing-library/react-native';

// jest.useFakeTimers();

test('view task page renders correctly', () => {
    const mockedParams = {
        route: { params: { task_id: 1 } },
        navigation: ''
    };

    render(<ViewTask {...mockedParams} />).toJSON();

});



