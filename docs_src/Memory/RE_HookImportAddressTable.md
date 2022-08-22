# RE_HookImportAddressTable
---
```cpp
void RE_HookImportAddressTable(void* newFunction, 
                               const char* importedFunctionName, 
                               const char* overrideModule, 
                               void** outOldFunction);
```

## <ins>Input:</ins>
* newFunction: function that gets called instead of the original one
* importedFunctionName: name of the imported function
* overrideModule: module of which the Import Address Table will be modified

## <ins>Output:</ins>
* outOldFunction: pointer to the original Function


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
    RE_HookImportAddressTable(MessageBoxAHook, 
                              "MessageBoxA", 
                              NULL, 
                              (void**)&originalMsgBoxFunc);
}
```

