const { createApp, ref } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

createApp({
  setup() {
    const ID = ref('');
    const Name = ref('');
    const dataList = ref([]);

    const addData = async () => {
      if (!ID.value || isNaN(ID.value)) {
        console.log("IDに数値が入力されていません");
        return;
      }

      const param = {
        ID: ID.value,
        Name: Name.value,
      };

      // 実際のAPI URLに置き換えてください
      const response = await axios.post('https://m3h-takahashi-containerapp.delightfulforest-b2ea18b6.japaneast.azurecontainerapps.io/api/INSERT', param);
      console.log(response.data);
    };

    const readData = async () => {
      // 実際のAPI URLに置き換えてください
      const response = await axios.get('https://m3h-takahashi-containerapp.delightfulforest-b2ea18b6.japaneast.azurecontainerapps.io/api/SELECT');
      console.log(response.data);
      dataList.value = response.data.List;
    };

    return {
      ID,
      Name,
      dataList,
      addData,
      readData,
    };
  },
})
  .use(vuetify)
  .mount('#app');
