# RE_CustomBPTrampolineHook
---
```cpp
void RE_CustomBPTrampolineHook(void* start, CustomFunc cbFunc);
```

## <ins>Input:</ins>
* start: function pointer that will be hooked.
* cbFunc: function that gets called instead of the original one

## <ins>Info:</ins>
<ins>**IMPORTANT: THIS HOOK IS NOT THREAD SAFE<br>LIMITED TO 4 HOOKS**<br></ins>
this function can be used to hook anywhere inside a function<br>
uses breakpoints to intercept a function


## <ins>Example:</ins>
Hooking MessageBoxA:
```cpp
CPU_STATE* MessageBoxAHook(CPU_STATE* state)
{
    // DO SOMETHING
    return state;
}
void ExampleMain()
{
    void* messageBoxFunc = (void*)GetProcAddr(GetModuleHandle(NULL), "MessageBoxA");
    RE_CustomBPTrampolineHook(messageBoxFunc, MessageBoxAHook);
}
```

