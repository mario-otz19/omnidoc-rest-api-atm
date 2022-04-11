const returnResponse = (res, responseStatusCode, responseData) => {
    if (responseStatusCode === 500) {
        return res.status(responseStatusCode).json({
            msg: '¡Ha ocurrido un error inesperado, favor de contactar al admin! D:'
        });
    }

    return res.status(responseStatusCode).json(responseData);
}

module.exports = {
    returnResponse
}