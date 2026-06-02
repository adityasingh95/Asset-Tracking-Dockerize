# impact-map.md  (FILL IN — Phase 3)

> Exactly what the change touches. Written BEFORE writing business code.

## New files
| File | Purpose |
|---|---|
| model/DecommissionRequest.java | request entity |
| model/DecommissionStatus.java | PENDING/APPROVED/REJECTED |
| repository/DecommissionRequestRepository.java | finders + guards |
| service/DecommissionService.java | request/approve/reject |
| controller/… | request + approver endpoints |
| templates/… | approver view, reason capture |

## Edited files
| File | Edit | Why |
|---|---|---|
| templates/assets.html | Delete → Request Decommission + reason; pending badge | UI‑01/02/03 |
| controller/AssetUIController.java | route request flow; resolve delete path | FA‑01 |
| … | | |

## Decisions (resolve here)
- Association style (assetId Long vs @ManyToOne): … because …
- REST `DELETE /assets/{id}` fate (gate / leave+label): … because …
- Pending‑badge computation: …

## Behaviours touched / at risk
- (list, mapped to EB‑/FA‑ IDs)
