# RE_CustomTrampolineHook
---
```cpp
void RE_CustomTrampolineHook(void* start, CustomFunc cbFunc);
```

## <ins>Input:</ins>
* start: function pointer that will be hooked.
* cbFunc: function that gets called instead of the original one

## <ins>Info:</ins>
<ins>**IMPORTANT: THIS HOOK IS NOT THREAD SAFE**</ins><br>
this function can be used to hook anywhere inside a function as long as the code flow allows it.<br>
invalid places are:<br>
* less than 5 instructions before a relative instruction (x64 only)<br>
* overwriting inbetween a jump destination<br>


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
    RE_CustomTrampolineHook(messageBoxFunc, MessageBoxAHook);
}
```

