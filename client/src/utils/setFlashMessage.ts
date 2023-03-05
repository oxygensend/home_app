import eventBus from './eventBus';

export const setFlashMessage = (
    message: string,
    type: string = 'success'
): void => {
    eventBus.emit('flash', { message, type });
    console.log('x');
};
