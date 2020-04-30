import { Injectable } from '@nestjs/common'
import { IContact } from '../contact/interfaces/contact.interface'
import { IPhone } from '../contact/interfaces/phone.interface'
import { SearchKeyDto } from './dto/search-key.dto'

@Injectable()
export class SearchService {

  async contactSearch(contacts: IContact[], { searchKey }: SearchKeyDto): Promise<IContact[]> {
    const regexp = new RegExp(`${searchKey}`, 'g')

    return contacts.filter(contact => {
      return this.nameCompare(contact.firstName, regexp, searchKey) ||
        this.nameCompare(contact.lastName, regexp, searchKey) ||
        this.phoneCompare(contact.phones, regexp, searchKey)
    })
  }

  nameCompare(name: string, keyRegExp, key): boolean {
    if (name && name.length >= key.length) {
      return name.toLowerCase().match(keyRegExp) != null ? true : false
    } else {
      return false
    }
  }

  phoneCompare(phones: Array<IPhone>, keyRegExp, key): boolean {
    let result = false
    if (phones && phones.length >= 1) {
      phones.forEach(phone => {
        if (phone && phone.phoneNumber.toString().length >= key.length) {
          const find = phone.phoneNumber.toString().toLowerCase().match(keyRegExp) != null ? true : false
          if (find) result = true
        } else {
          return false
        }
      })
    } else {
      return false
    }
    return result
  }


}

