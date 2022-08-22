# RE_EndHook
---
```cpp
void RE_EndHook(void* start_or_cb_func);
```

## <ins>Input:</ins>
* start_or_cb_func: old function pointer or hookfunction pointer

## <ins>Output:</ins>
* outOldFunction: pointer to the original Function


## <ins>Example:</ins>
EndHook MessageBoxA:
```cpp
int MessageBoxAHook(HWND hWnd, LPCSTR lpText, LPCSTR lpCaption, UINT uType);
void ExampleMain()
{
#ifdef USE_OG
    RE_EndHook((void*)MessageBoxA); // whatever pointer was used to start the hook
#else
    RE_EndHook((void*)MessageBoxAHook);
#endif
}
```

