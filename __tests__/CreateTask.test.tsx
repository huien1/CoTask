import CreateTask from '../pages/createTask';
import { render, screen, userEvent } from '@testing-library/react-native';

jest.useFakeTimers();

test('create task page renders correctly', async () => {
    const user = userEvent.setup();

    render(<CreateTask  />);

    // const handleSubmit = jest.fn();
    // const { getByText } = render(<CreateTask onSubmit={handleSubmit} />);
    // const submitButton = getByText('Add');
    // fireEvent.click(submitButton);
    // expect(handleSubmit).toHaveBeenCalledTimes(1);
    await user.press(screen.getByRole('addButton', { name: 'Add' }));

});



