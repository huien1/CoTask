import EditTask from '../pages/editTask';
import { render, screen, userEvent } from '@testing-library/react-native';

jest.useFakeTimers();

test('edit task page renders correctly', async () => {
    const mockedParams = {
        route: { params: { task_id: 0 } },
        navigation: ''
    };

    render(<EditTask {...mockedParams} />).toJSON();
});

test('user can create task without updating the form', async() => {
    const user = userEvent.setup();

    const mockedParams = {
        route: { params: { task_id: 0 } },
        navigation: ''
    };
    render(<EditTask {...mockedParams} />).toJSON();

    await user.press(screen.getByRole('editButton', { name: 'Edit' }));

    expect(await screen.findByText('Edited on')).toBeOnTheScreen();

})