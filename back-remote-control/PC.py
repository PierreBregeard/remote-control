import keyboard

class PC:

    def set_volume(vol):
        for _ in range(50):
            keyboard.press_and_release("volume down")
        for _ in range(vol // 2):
            keyboard.press_and_release("volume up")
    
    def next_track():
        keyboard.press_and_release("next track")

    def previous_track():
        keyboard.press_and_release("previous track")

    def pp_media():
        keyboard.press_and_release("play/pause media")

if __name__ == "__main__":
    PC.pp_media()