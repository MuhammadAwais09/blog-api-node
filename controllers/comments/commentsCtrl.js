// create Comments 
const createCommentsCtrl = async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Comments created"
        })
    } catch (error) {
        res.json(error.message);
    }
}


//single Comments 
const singleCommentsCtrl =  async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Comments single routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Delete Comments
const deleteCommentsCtrl = async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Delete Comments routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Update Comments 

const updateCommentsCtrl = async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Update Comments routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}
module.exports = {
    createCommentsCtrl,
    singleCommentsCtrl,
    deleteCommentsCtrl,
    updateCommentsCtrl
}