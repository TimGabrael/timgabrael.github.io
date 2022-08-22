# RE_EasyTrampolineHook
---
```cpp
void RE_EasyTrampolineHook(void* start, void* cbFunc);
```

## <ins>Input:</ins>
* start: function pointer that will be hooked.
* cbFunc: function that gets called before the original one

## <ins>Info:</ins>
In x86 the function will have the return value pushed on the stack 
theirfore the __stdcall functions will have an additional parameter before the others

## <ins>Example:</ins>
Hooking MessageBoxA:
```cpp
#ifdef _WIN64
void MessageBoxAHook(HWND hWnd, LPCSTR lpText, LPCSTR lpCaption, UINT uType)
{
    // DO SOMETHING
}
#else
void MessageBoxAHook(void* r, HWND hWnd, LPCSTR lpText, LPCSTR lpCaption, UINT uType)
{
    // DO SOMETHING
}
#endif

void ExampleMain()
{
    void* messageBoxFunc = (void*)GetProcAddr(GetModuleHandle(NULL), "MessageBoxA");
    RE_EasyTrampolineHook(messageBoxFunc, (void*)MessageBoxAHook);
}
```