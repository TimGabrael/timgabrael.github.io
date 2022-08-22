# <ins>Memory.h</ins>
---
## <ins>Functions:</ins>
### <ins>Hooking and Misc:</ins>
* [RE_ldisasm](Memory/RE_ldisasm.html)
* [RE_SetHookPause](Memory/RE_SetHookPause.html)
* [RE_DirectTrampolineHook](Memory/RE_DirectTrampolineHook.html)
* [RE_EasyTrampolineHook](Memory/RE_EasyTrampolineHook.html)
* [RE_CustomTrampolineHook](Memory/RE_CustomTrampolineHook.html)
* [RE_TSCustomTrampolineHook](Memory/RE_TSCustomTrampolineHook.html)
* [RE_CustomBPTrampolineHook](Memory/RE_CustomBPTrampolineHook.html)
* [RE_HookImportAddressTable](Memory/RE_HookImportAddressTable.html)
* [RE_EndHook](Memory/RE_EndHook.html)
* [RE_ReadPointerRPM](Memory/RE_ReadPointerRPM.html)
* [RE_ReadPointerQuery](Memory/RE_ReadPointerQuery.html)
* [RE_ReadPointer](Memory/RE_ReadPointer.html)
* [RE_ScanPattern](Memory/RE_ScanPattern.html)
* [RE_GetAttachedWindow](Memory/RE_GetAttachedWindow.html)
### <ins>Rendering:</ins>
* RE_HookRendering
* RE_EndRendering
* RE_ToScreenSpace
* RE_ToNormalizedSpace
* RE_WorldToScreen
* RE_DrawTriangle
* RE_DrawQuad
* RE_DrawTexQuad
* RE_DrawCircle
* RE_DrawLine
* RE_DrawString
* RE_DrawStringEx
* RE_NDrawQuad
* RE_NDrawTexQuad
* RE_NDrawCircle
* RE_NDrawTriangle

## <ins>Types:</ins>
* CPU_STATE
* PTR
* fvec2
* CustomFunc

## <ins>Info:</ins>
How to include:
```cpp
// adds the function definitions
#define _DEF_ 

 // use the specified graphics api for rendering enables all Rendering functions
#define {GRAPHICS_API}

// enable logging
#define RE_LOG_INFOS


#include "Memory.h"   
```
### Available Graphics Apis:
* D3D11
* OPENGL
* D3D9
* D3D12
* VULKAN