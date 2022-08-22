# RE_DirectTrampolineHook
---
```cpp
void RE_DirectTrampolineHook(void* start, void* cbFunc, void** oldFunc);
```

## <ins>Input:</ins>
* start: function pointer that will be hooked.
* cbFunc: function that gets called instead of the original one

## <ins>Output:</ins>
* oldFunc: pointer to the original Function


## <ins>Example:</ins>
Hooking MessageBoxA:
```cpp
static int(*originalMsgBoxFunc)(HWND, LPCSTR, LPCSTR, UINT) = nullptr;
int MessageBoxAHook(HWND hWnd, LPCSTR lpText, LPCSTR lpCaption, UINT uType)
{
    // DO SOMETHING MAYBE NOT EVEN CALL ORIGINAL FUNCTION
    return originalMsgBoxFunc(hWnd, lpText, lpCaption, uType);
}

void ExampleMain()
{
    void* messageBoxFunc = (void*)GetProcAddr(GetModuleHandle(NULL), "MessageBoxA");
    RE_DirectTrampolineHook(messageBoxFunc, 
                            (void*)MessageBoxAHook, 
                            (void**)&originalMsgBoxFunc);
}
```

