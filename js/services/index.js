function Services(){
    this.getListPhonesAPI = function(){
        return axios({
            url: "https://62986710f2decf5bb7416a75.mockapi.io/Capstone_02",
            method: "GET"
        })    
    }

    this.getPhoneAPI = function(id){
        return axios({
            url: `https://62986710f2decf5bb7416a75.mockapi.io/Capstone_02/${id}`,
            method: "GET"
        })
    }
}