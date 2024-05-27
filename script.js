function applyHamming() {
    const bitSelect = document.getElementById('bitSelect').value;   //Seçilen bit sayısı 
    const bitInput = document.getElementById('input-data').value.trim();
    const resultDiv = document.getElementById('result');
    const checkBitNumberDiv = document.getElementById('check-bitnumber');
    const checkBitLocationDiv = document.getElementById('check-bit-location');
    
     // Verinin bit uzunluğunu kontrol edin
     if (bitInput.length != bitSelect) {
        resultDiv.innerText = `Lütfen ${bitSelect} bitlik veri girin.`;
        checkBitNumberDiv.innerText = '';
        checkBitLocationDiv.innerText = '';
        
    }
    else if (!/^[01]+$/.test(bitInput)) { // Sadece 0 ve 1 içermeli

        resultDiv.innerText = 'Lütfen geçerli bir bit dizisi girin (sadece 0 ve 1)';
        checkBitNumberDiv.innerText = '';
        checkBitLocationDiv.innerText = '';
        
    }
    else{
        resultDiv.innerText = 'Veri belleğe kaydedildi.';
        var inputData = document.getElementById("input-data").value;
        var hammingCode = calculateHamming(inputData);
        document.getElementById("memory-code").textContent = hammingCode;
        saveToMemory(inputData,hammingCode);;
      
        
      
        
        
    }
      
    document.getElementById('input-data').value = ''; // Bu satır eklenmiş, veri girilen alanı temizler
    document.getElementById('result').innerText = '';
    document.getElementById('hamming-code').innerText = '';
    document.getElementById('check-bitnumber').innerText = '';
    document.getElementById('memory-code').innerText = '';
 }
 
// Depolama için bir dizi
let memory = [];

function saveToMemory(data, hammingCode) {
    // Veriyi ve hamming kodunu bir nesne olarak birleştirin
    let memoryObject = {
        data: data,
        hammingCode: hammingCode
    };

    // Bu nesneyi listeye ekleyin
    memory.push(memoryObject);
    updateMemoryList();
    
    
}


function updateMemoryList() {
    // hamming-list elemanını seçin
    const listElement = document.getElementById("hamming-list");

    // Listeyi temizleyin
    listElement.innerHTML = '';

    if (memory.length === 0) {
        const listItem = document.createElement("li");
        listItem.textContent = "Bellekte veri bulunamadı.";
        listElement.appendChild(listItem);
        document.getElementById("item-count").textContent="0"; 
    } else {
        memory.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. Data: ${item.data} | Hamming Code: ${item.hammingCode}`;
            listElement.appendChild(listItem);
            document.getElementById("item-count").textContent=`${index + 1}`; 
        });
    }
    // Liste öğesine tıklanma olayını ekleyin
    listItem.addEventListener('click', () => {
        const selectedItems = document.querySelectorAll('#hamming-list li.selected');
        selectedItems.forEach(el => el.classList.remove('selected'));
        listItem.classList.add('selected');
    });

    listElement.appendChild(listItem);
   
}

document.getElementById("toggle-list").addEventListener('click', () => {
    const listElement = document.getElementById("hamming-list");
    listElement.classList.toggle('hidden');
    listElement.style.display = listElement.classList.contains('hidden') ? 'none' : 'block';
});

function calculateHamming(data) {
    
    var checkBits = checkBitsNumber(data); //Gerekli check bit sayısı hesaplandı
    var hammingCode = mergeCheckBits(data,checkBits); // Data bit , Check Bit ile birleştirildi check bit default olarak 0 atandı ve sonra hesaplanarak hamming code değerine atandı
   
   return hammingCode;
}

//Check bit sayısı hesaplama
function checkBitsNumber(data){
    // Veri uzunluğuna göre gerekli Hamming kodu bit sayısını belirle
    var checkBits = 0;
    while (Math.pow(2, checkBits) < data.length + checkBits + 1) {
        checkBits++;
    }
    document.getElementById("check-bitnumber").textContent=checkBits;
    return checkBits  
}


// Data Bits and Check Bits birleşimi konumlandırma 
function mergeCheckBits(data, checkBitCount) {
   
    var hammingCode = [];    //boş dizi
    var dataLength = data.length; // data uzunluğu
  
    
    // Check bitlerin yerleştirilmesi
    for (var i = 0 ,j = dataLength - 1,k=0 ; i < dataLength + checkBitCount ; i++) { 
        if(isPowerOfTwo(i+1)){      //2'nin üssü ise check bit
            // Bu bir kontrol biti, başlangıçta 0 olarak ayarla
            hammingCode[i] =0;
            k++;
          
        } else {
            // Bu bir veri biti, veriyi yerleştir
            hammingCode[i] = data[j];
            j--;
         
            
        }
    }
    
    hammingCode.reverse();   // bitleri sağdan sayarak numaralandırma yaptığımız için reverse yaparak veriyi doğru şekilde göstermiş olduk
    
    //Check bit değeri hesaplama ve yerine yerleştirme işlemi
    var xorResult = 0;
    for(var i =0 ;i<hammingCode.length;i++){
        if(hammingCode[i]==1){
            var position = hammingCode.length - i
            xorResult ^= position
        }
    }
    var xorBinary = xorResult.toString(2);  //xor sonucu binary formatına dönüştürüldü
    xorBinary = xorBinary.padStart(checkBitCount, '0'); // Check bit sayısı kadar değer olmasını için binary değer önüne 0 eklendi  
    document.getElementById("hamming-code").textContent=xorBinary;
   
    var xorBinaryArray = xorBinary.split('');    //Hesaplanan binary check bitlerin yerine yerleşmesi için array formatına dönüştürüldü
    var xorIndex =0;
    
    for(var i=hammingCode.length ; i>0 ; i--){
        if(isPowerOfTwo(i)){      //2'nin üssü ise check bit
    
            hammingCode[hammingCode.length - i] =xorBinaryArray[xorIndex];  
            xorIndex++
        } 

    }
   
    return hammingCode.join('');  // Diziyi string'e dönüştür ve döndür
}

function isPowerOfTwo(number) {
      // Eğer sayı 0 veya negatifse, 2'nin üssü olamaz.
    if (number <= 0) {
        return false;
    }
    
    // Sayıyı sürekli olarak 2'ye böleriz, 
    // böldüğümüzde kalan olması durumunda 2'nin üssü değildir.
    while (number > 1) {
        if (number % 2 !== 0) {
            return false;
        }
        number /= 2;
    }
    
    // Eğer while döngüsünden çıktıysak, sayı 2'nin üssüdür.
    return true;
}
//index numarısına göre seçilen datayı döndürme fonksiyonu 

function returnSelectedData() {
    var selected_index = parseInt(document.getElementById('input-selected-data').value) - 1;
    var selectedItem = memory[selected_index];
    
    if (!selectedItem) {
        document.getElementById("selected-data").textContent = "Veri bulunamadı.";
        return null; 
    } else {
        document.getElementById("selected-data").textContent = `${selectedItem.data}`;
        return selectedItem.data;
    }
}
function returnSelectedDataH() {
    var selected_index = parseInt(document.getElementById('input-selected-data').value) - 1;
    var selectedItem = memory[selected_index];
    
    if (!selectedItem || !selectedItem.hammingCode) {
        document.getElementById("h-code").textContent = "Hamming kodu bulunamadı.";
        return null; 
    } else {
        document.getElementById("h-code").textContent = `${selectedItem.hammingCode}`;
        return selectedItem.hammingCode;
    }
}


function returnSelectedHamming(){
    var selected_index = parseInt(document.getElementById('input-selected-data').value) - 1;
    var selectedItem = memory[selected_index];
    
    var dataArray = selectedItem.hammingCode.split('');
    dataArray.reverse();
    var newArray = [];
    for (var i = 0; i < dataArray.length; i++) {
        if ((i & (i + 1)) === 0) {
            newArray.push(dataArray[i]);
        }
    }
    newArray.reverse();
    
    // Yeni diziyi döndür 
    return newArray.join('');
}
 


function applyError(){
    var new_data = returnSelectedData();

    var dataArray = new_data.split('');
    dataArray.reverse();
    var index_value = parseInt(document.getElementById("selected-data-index").value)- 1;

    if (isNaN(index_value) ) {
        document.getElementById("new-data").textContent = "Geçersiz index numarası";
        return;
    }
    
    if(dataArray[index_value]=="0"){
        dataArray[index_value]="1";
    }
    else if(dataArray[index_value]=="1"){
        dataArray[index_value]="0";
    }
    else{
        document.getElementById("new-data").textContent = "Hatalı veri ";
    }
    dataArray.reverse();
    
    var new_data = dataArray.join('');
    document.getElementById("new-data").textContent =new_data;

    var position = findDataBitPosition(index_value);
    if(dataArray[index_value]==="1"){
    var xorResult1 = returnSelectedHamming() ^ position ;
    var xorResult2 = xorResult1 ^ returnSelectedHamming();

    }
    
    document.getElementById("sendrom-word").textContent=xorResult2;
    
    fillBitTable(xorResult2);
   
}

function findDataBitPosition(dataBitIndex) {
    let position = 0;
    let count = 0;

    while (count < dataBitIndex) {
        position++;
        // pozisyon 2nin üssü ise atla
        if ((position & (position - 1)) === 0) {
            continue;
        }
        count++;
    }
    position++; //index 0 dan başladığı için 1 eklendi
    var position_binary = position.toString(2);
    return position_binary;
}

function fillBitTable(xorResult2) {
    var bitValues = returnSelectedDataH(); // Bit değerlerini al

    // Bit tablosunu temizle
    var table = document.getElementById("bit-table");
    table.innerHTML = ''; // Tüm içeriği temizle

    // Başlık satırını ekle
    var headerRow = table.insertRow();
    var bitNumberCell = headerRow.insertCell();
    bitNumberCell.textContent = "Bit Number"; // Bit numarasını yaz

    // Bit numaralarını ve değerlerini tabloya yatay olarak ekle
    var dataRow = table.insertRow();
    var bitNumberCell = dataRow.insertCell();
    bitNumberCell.textContent = "Bit Value"; // Bit değeri yaz

    var xorResult2Int = parseInt(xorResult2, 2);

    for (var i = 0; i < bitValues.length; i++) {
        var headerCell = headerRow.insertCell();
        headerCell.textContent = bitValues.length - i;

        var cell = dataRow.insertCell();
        cell.textContent = bitValues[i];
        ;
        if (xorResult2Int === bitValues.length -i ) {
            cell.style.color = "red";
           if(cell.textContent==0){
            cell.textContent = 1;
           }
           else{
            cell.textContent = 0;
           }
        }
    }
    

    
    document.getElementById("bit-table-container").style.display = "block";
}

