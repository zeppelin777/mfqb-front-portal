import { areaList } from '@vant/area-data'

const areaData = []
areaData.push({
  value: '000000',
  label: '全国'
})
for (const a in areaList.province_list) {
  areaData.push({
    value: a,
    label: areaList.province_list[a],
    children: []
  })
  for (const b in areaList.city_list) {
    if (b.substr(0, 2) === a.substr(0, 2)) {
      areaData[areaData.length - 1].children.push({
        value: b,
        label: areaList.city_list[b]
      })
    }
  }
}

export default areaData
